import { GET_COUNT, GET_QUESTION } from './constants';

function main() {
  if (window.hasRun) {
    // don't run if the code has already been injected into the page
    return;
  }
  // some constants
  const SOLVED_QUESTIONS_SELECTOR = 'div[role="listitem"]:is(.bg-emerald-50)';
  const UNSOLVED_QUESTIONS_SELECTOR = 'div[role="listitem"]:not(.bg-emerald-50)';

  window.hasRun = true;

  const getRandomEntry = (selector) => {
    const results = document.querySelectorAll(selector);

    const ans = [];

    for (const result of results) {
      const anchorTag = result.querySelector('a');
      ans.push(anchorTag.href);
    }
    const index = Math.floor(Math.random() * ans.length);
    return ans[index];
  };

  const getSolvedQuestions = () => Array.from(document.querySelectorAll(SOLVED_QUESTIONS_SELECTOR));
  const getSolvedQuestionsCount = () => getSolvedQuestions().length;

  const getUnsolvedQuestions = () =>
    Array.from(document.querySelectorAll(UNSOLVED_QUESTIONS_SELECTOR));
  const getUnsolvedQuestionsCount = () => getUnsolvedQuestions().length;

  const getQuestionsOfDifficulty = (questionType, targetDifficulty) => {
    let questions;
    if (questionType === 'solved') {
      questions = getSolvedQuestions();
    } else if (questionType === 'unsolved') {
      questions = getUnsolvedQuestions();
    } else {
      questions = getSolvedQuestions().concat(getUnsolvedQuestions());
    }
    return questions.filter((question) => {
      const difficulty = question.querySelector('.flex.space-x-2 span');
      return difficulty?.textContent.toLowerCase() === targetDifficulty.toLowerCase();
    });
  };

  browser.runtime.onMessage.addListener(({ action, data }) => {
    switch (action) {
      case GET_QUESTION: {
        const { solved, unsolved } = data;
        if (solved && unsolved) {
          return browser.runtime.sendMessage({
            action,
            data: {
              url: getRandomEntry('div[role="listitem"]'),
            },
          });
        }

        if (solved) {
          return browser.runtime.sendMessage({
            action,
            data: {
              url: getRandomEntry('div[role="listitem"]:is(.bg-emerald-50)'),
            },
          });
        }

        if (unsolved) {
          return browser.runtime.sendMessage({
            action,
            data: {
              url: getRandomEntry('div[role="listitem"]:not(.bg-emerald-50)'),
            },
          });
        }
        return undefined;
      }
      case GET_COUNT: {
        return browser.runtime.sendMessage({
          action,
          data: {
            solved: getSolvedQuestionsCount(),
            unsolved: getUnsolvedQuestionsCount(),
            easySolved: getQuestionsOfDifficulty('solved', 'easy').length,
            mediumSolved: getQuestionsOfDifficulty('solved', 'medium').length,
            hardSolved: getQuestionsOfDifficulty('solved', 'hard').length,
            easyUnsolved: getQuestionsOfDifficulty('unsolved', 'easy').length,
            mediumUnsolved: getQuestionsOfDifficulty('unsolved', 'medium').length,
            hardUnsolved: getQuestionsOfDifficulty('unsolved', 'hard').length,
          },
        });
      }
      default: {
        return undefined;
      }
    }
  });
}

main();
