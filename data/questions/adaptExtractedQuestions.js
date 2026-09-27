import { applyImageQuestionCorrections } from './imageQuestionCorrections';

const typeLabels = {
  single_select: 'Multiple Choice',
  multiple_select: 'Multiple Select',
  dropdown: 'Dropdown',
  drag_and_drop: 'Drag and Drop',
  yes_no: 'Yes/No'
};

const toId = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const answerText = (answer) => {
  if (answer === null || answer === undefined) return null;
  return typeof answer === 'string' ? answer : JSON.stringify(answer);
};

const normalizeAnswer = (answer) => String(answer).trim().toLowerCase();

function normalizeQuestion(record) {
  const base = {
    id: `source-q${record.question_number}`,
    number: record.question_number,
    type: typeLabels[record.question_type] || 'Unspecified in source',
    question: record.question,
    sourceCorrectAnswer: answerText(record.correct_answer),
    correctAnswers: [],
    gradingAvailable: false
  };

  if (record.question_type === 'single_select' || record.question_type === 'multiple_select') {
    const options = (record.options || []).map((option) => ({
      id: option.label.toLowerCase(),
      label: `${option.label}. ${option.text}`
    }));
    const sourceAnswers = Array.isArray(record.correct_answer)
      ? record.correct_answer
      : [record.correct_answer];
    const correctAnswers = sourceAnswers
      .map((answer) => {
        const answerLabel = String(answer).trim().match(/^([A-F])(?:\s*[:.])/i)?.[1]?.toLowerCase();
        if (answerLabel && options.some((option) => option.id === answerLabel)) return answerLabel;
        const matchingOption = (record.options || []).find((option) => (
          normalizeAnswer(option.label) === normalizeAnswer(answer)
          || normalizeAnswer(option.text) === normalizeAnswer(answer)
        ));
        return matchingOption?.label.toLowerCase();
      })
      .filter(Boolean);

    return {
      ...base,
      questionType: record.question_type === 'multiple_select' ? 'multi-select' : 'single-choice',
      options,
      correctAnswers,
      gradingAvailable: sourceAnswers.length > 0 && correctAnswers.length === sourceAnswers.length
    };
  }

  if (record.question_type === 'dropdown' && record.options && !Array.isArray(record.options)) {
    const entries = Object.entries(record.options);
    const answerEntries = record.correct_answer && typeof record.correct_answer === 'object'
      ? Object.entries(record.correct_answer)
      : Array.isArray(record.correct_answer)
        ? entries.map(([key], index) => [key, record.correct_answer[index]])
        : [];
    const answerFields = entries.map(([label, values]) => ({
      id: toId(label),
      label,
      options: values.map((option, index) => ({
        id: `${toId(label)}-${index}`,
        label: String(option)
      }))
    }));
    const correctAnswers = [];

    for (const [label, answer] of answerEntries) {
      const field = answerFields.find((item) => item.label === label);
      const option = field?.options.find((item) => (
        normalizeAnswer(item.label) === normalizeAnswer(answer)
      ));
      if (field && option) correctAnswers.push(`${field.id}:${option.id}`);
    }

    return {
      ...base,
      questionType: 'multi-dropdown',
      answerFields,
      correctAnswers,
      gradingAvailable: answerEntries.length === answerFields.length
        && correctAnswers.length === answerFields.length
    };
  }

  if (record.question_type === 'yes_no') {
    const answers = Array.isArray(record.correct_answer) ? record.correct_answer : [];
    const answerFields = answers.map((_, index) => ({
      id: `response-${index + 1}`,
      label: `Response ${index + 1}`,
      options: (record.options || []).map((option) => ({
        id: String(option).toLowerCase(),
        label: String(option)
      }))
    }));
    const correctAnswers = answerFields.map((field, index) => {
      const option = field.options.find((item) => (
        normalizeAnswer(item.label) === normalizeAnswer(answers[index])
      ));
      return option ? `${field.id}:${option.id}` : null;
    }).filter(Boolean);

    return {
      ...base,
      questionType: 'multi-dropdown',
      answerFields,
      correctAnswers,
      gradingAvailable: answers.length > 0 && correctAnswers.length === answers.length
    };
  }

  if (record.question_type === 'drag_and_drop' && Array.isArray(record.options)) {
    const configurations = record.options.map((label, index) => ({
      id: `choice-${index}`,
      label: String(label)
    }));
    const answerIsObject = record.correct_answer && typeof record.correct_answer === 'object'
      && !Array.isArray(record.correct_answer);
    const answerEntries = answerIsObject
      ? Object.entries(record.correct_answer)
      : Array.isArray(record.correct_answer)
        ? record.correct_answer.map((answer, index) => [`Answer ${index + 1}`, answer])
        : [];
    const pipelines = answerEntries.map(([label], index) => ({
      id: `target-${index + 1}`,
      label: answerIsObject ? label : `Answer ${index + 1}`
    }));
    const correctAnswers = answerEntries.map(([, answer], index) => {
      const configuration = configurations.find((item) => (
        normalizeAnswer(item.label) === normalizeAnswer(answer)
      ));
      return configuration ? `${pipelines[index].id}:${configuration.id}` : null;
    }).filter(Boolean);

    return {
      ...base,
      questionType: 'drag-drop',
      configurations,
      pipelines,
      correctAnswers,
      gradingAvailable: answerEntries.length > 0 && correctAnswers.length === answerEntries.length
    };
  }

  return {
    ...base,
    questionType: 'source-unknown'
  };
}

export function adaptExtractedQuestions(records) {
  return records.map((record) => applyImageQuestionCorrections(normalizeQuestion(record)));
}
