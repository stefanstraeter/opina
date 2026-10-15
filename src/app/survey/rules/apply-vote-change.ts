import { Question } from '@survey/model/interfaces/question';
import { Survey } from '@survey/model/interfaces/survey';

/**
 * @description Returns a copy of the survey in which one answer has new votes.
 * The original survey is not changed, so a signal can notice the new object.
 * If no answer of this survey has the given id, the survey stays as it is.
 * @export
 * @param {Survey} survey - The survey as it is shown right now.
 * @param {number} answerId - The id of the answer whose votes changed.
 * @param {number} votes - The new number of votes of this answer.
 * @return {Survey} - A new survey object with the updated votes.
 */
export function applyVoteChange(
  survey: Survey,
  answerId: number,
  votes: number,
): Survey {
  return {
    ...survey,
    questions: survey.questions.map((question) =>
      withAnswerVotes(question, answerId, votes),
    ),
  };
}

/**
 * @description Returns a copy of the question in which the answer with the
 * given id has the new votes. All other answers stay the same.
 * @param {Question} question
 * @param {number} answerId
 * @param {number} votes
 * @return {Question}
 */
function withAnswerVotes(
  question: Question,
  answerId: number,
  votes: number,
): Question {
  return {
    ...question,
    answers: question.answers.map((answer) =>
      answer.id === answerId ? { ...answer, votes } : answer,
    ),
  };
}
