import { GET_COUNT, GET_QUESTION } from './constants';
import '../stylesheets/style.css';

const button = document.querySelector('#random_button');
const solvedRadio = document.querySelector('#solved');
const unsolvedRadio = document.querySelector('#unsolved');
const solvedCount = document.querySelector('#solved_count');
const unsolvedCount = document.querySelector('#unsolved_count');
const easySolvedCount = document.querySelector('#easy_solved_count');
const mediumSolvedCount = document.querySelector('#medium_solved_count');
const hardSolvedCount = document.querySelector('#hard_solved_count');
const easyUnsolvedCount = document.querySelector('#easy_unsolved_count');
const mediumUnsolvedCount = document.querySelector('#medium_unsolved_count');
const hardUnsolvedCount = document.querySelector('#hard_unsolved_count');

button.addEventListener('click', async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!solvedRadio.checked && !unsolvedRadio.checked) {
    browser.tabs.create({
      url: 'https://www.youtube.com/watch?v=eBGIQ7ZuuiU',
    });
    window.close();
    return;
  }
  browser.tabs.sendMessage(tabs[0].id, {
    action: GET_QUESTION,
    data: {
      solved: solvedRadio.checked,
      unsolved: unsolvedRadio.checked,
    },
  });
});

const currentTab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];

if (!currentTab.url.startsWith('https://www.techinterviewhandbook.org/grind75')) {
  browser.tabs.create({
    url: 'https://www.techinterviewhandbook.org/grind75',
  });
  window.close();
}

browser.runtime.onMessage.addListener(({ action, data }) => {
  switch (action) {
    case GET_QUESTION: {
      const { url } = data;
      browser.tabs.create({
        url,
      });
      window.close();
      break;
    }
    case GET_COUNT: {
      const {
        solved,
        unsolved,
        easySolved,
        mediumSolved,
        hardSolved,
        easyUnsolved,
        mediumUnsolved,
        hardUnsolved,
      } = data;

      const totalQuestions = solved + unsolved;

      solvedCount.textContent = `${solved}(${((solved / totalQuestions) * 100).toFixed(2)}%)`;
      unsolvedCount.textContent = `${unsolved}(${((unsolved / totalQuestions) * 100).toFixed(2)}%)`;
      easySolvedCount.textContent = easySolved;
      mediumSolvedCount.textContent = mediumSolved;
      hardSolvedCount.textContent = hardSolved;
      easyUnsolvedCount.textContent = easyUnsolved;
      mediumUnsolvedCount.textContent = mediumUnsolved;
      hardUnsolvedCount.textContent = hardUnsolved;
      break;
    }
    default: {
      // eslint-disable-next-line no-console
      console.error('something went wrong');
    }
  }
});

await browser.tabs.executeScript({ file: 'content-script.js' });

browser.tabs.sendMessage(currentTab.id, {
  action: GET_COUNT,
});
