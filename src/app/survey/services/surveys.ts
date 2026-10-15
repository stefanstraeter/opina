import { computed, inject, signal, Service } from '@angular/core';
import { Supabase } from '@core/services/supabase';
import { todayAsIsoDate } from '@shared/utils/date';
import { Survey } from '@survey/model/interfaces/survey';
import { Answer, Question } from '@survey/model/interfaces/question';
import { getEndingSoonSurveys } from '@survey/rules/ending-soon-surveys';

const VOTE_CHANNEL_NAME = 'answers-votes';

@Service()
export class Surveys {
  private supabase = inject(Supabase);
  private surveysSignal = signal<Survey[]>([]); // read + write access
  surveys = this.surveysSignal.asReadonly(); // read-only access
  endingSoonSurveys = computed(() =>
    getEndingSoonSurveys(this.surveysSignal(), todayAsIsoDate()),
  );

  constructor() {
    this.loadSurveys();
  }

  /**
   * @description Loads all surveys with their questions and answers
   * from Supabase and writes them into the signal.
   * @return {Promise<void>} - A promise that resolves when the surveys are loaded.
   * @memberof Surveys
   */
  async loadSurveys(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .select('*, questions(*, answers(*))')
      .order('id', { referencedTable: 'questions' })
      .order('id', { referencedTable: 'questions.answers' });

    if (error) {
      console.error('Could not load surveys:', error);
      return;
    }

    this.surveysSignal.set((data ?? []) as Survey[]);
  }

  /**
   * @description Loads a single survey by id directly from Supabase,
   * used by the detail page.
   * @param {number} id
   * @return {Promise<Survey | undefined>} - The survey, or undefined if it could not be loaded or no survey has this id.
   * @memberof Surveys
   */
  async getSurveyById(id: number): Promise<Survey | undefined> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .select('*, questions(*, answers(*))')
      .order('id', { referencedTable: 'questions' })
      .order('id', { referencedTable: 'questions.answers' })
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Could not load survey:', error);
      return undefined;
    }

    return (data as Survey | null) ?? undefined;
  }

  /**
   * @description Creates a new survey with all its questions and answers
   * in Supabase, then reloads the list. The survey is saved first, since every
   * question needs its id. Questions (and each question's answers) are then
   * saved in parallel, since they don't depend on each other.
   * @param {Survey} survey
   * @return {Promise<void>} - Resolves when the survey is saved and the list is reloaded.
   * @memberof Surveys
   */
  async addSurvey(survey: Survey): Promise<void> {
    const surveyId = await this.insertSurvey(survey);

    await Promise.all(
      survey.questions.map(async (question) => {
        const questionId = await this.insertQuestion(question, surveyId);
        await Promise.all(
          question.answers.map((answer) =>
            this.insertAnswer(answer, questionId),
          ),
        );
      }),
    );
    await this.loadSurveys();
  }

  /**
   * @description Adds one vote to each of the given answers in Supabase.
   * The counting happens in the database function `increment_votes`, in one
   * call, so all votes count together and parallel voters can't overwrite
   * each other.
   * @param {number[]} answerIds - The ids of all selected answers.
   * @return {Promise<void>} - Resolves when the votes are saved.
   * @memberof Surveys
   */
  async submitVotes(answerIds: number[]): Promise<void> {
    const { error } = await this.supabase.client.rpc('increment_votes', {
      answer_ids: answerIds,
    });
    if (error) {
      throw new Error(`Could not submit votes: ${error.message}`);
    }
  }

  /**
   * @description Listens to changed answers in Supabase (Realtime). Every time
   * the votes of an answer change, the callback gets the answer id and its
   * new votes. All surveys are reported, the caller ignores unknown ids.
   * @param {(answerId: number, votes: number) => void} onChange
   * @return {() => void} - Call it to stop listening, e.g. in ngOnDestroy.
   * @memberof Surveys
   */
  subscribeToVoteChanges(
    onChange: (answerId: number, votes: number) => void,
  ): () => void {
    const channel = this.supabase.client
      .channel(VOTE_CHANNEL_NAME)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'answers' },
        (payload) => {
          const answer = payload.new as Answer;
          onChange(answer.id, answer.votes);
        },
      )
      .subscribe();
    return () => this.supabase.client.removeChannel(channel);
  }

  /**
   * @description Inserts one survey row (without questions).
   * @private
   * @param {Survey} survey
   * @return {Promise<number>} - The id of the new survey row.
   * @memberof Surveys
   */
  private async insertSurvey(survey: Survey): Promise<number> {
    const { data, error } = await this.supabase.client
      .from('surveys')
      .insert({
        title: survey.title,
        category: survey.category,
        deadline: survey.deadline || null,
        description: survey.description,
      })
      .select()
      .single();
    if (error || !data) {
      throw new Error(`Could not create survey: ${error?.message}`);
    }

    return data.id;
  }

  /**
   * @description Inserts one question row (without answers).
   * @private
   * @param {Question} question
   * @param {number} surveyId
   * @return {Promise<number>} - The id of the new question row.
   * @memberof Surveys
   */
  private async insertQuestion(
    question: Question,
    surveyId: number,
  ): Promise<number> {
    const { data, error } = await this.supabase.client
      .from('questions')
      .insert({
        text: question.text,
        multiple: question.multiple,
        survey_id: surveyId,
      })
      .select()
      .single();
    if (error || !data) {
      throw new Error(`Could not create question: ${error?.message}`);
    }

    return data.id;
  }

  /**
   * @description Inserts one answer row. Database sets `votes` to 0
   * automatically, so no id needs to be returned here.
   * @private
   * @param {Answer} answer
   * @param {number} questionId
   * @return {Promise<void>} - Resolves when the answer is saved.
   * @memberof Surveys
   */
  private async insertAnswer(
    answer: Answer,
    questionId: number,
  ): Promise<void> {
    const { error } = await this.supabase.client.from('answers').insert({
      text: answer.text,
      question_id: questionId,
    });
    if (error) {
      throw new Error(`Could not create answer: ${error.message}`);
    }
  }
}
