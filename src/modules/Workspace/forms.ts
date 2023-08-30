import uuid from "react-uuid";

import { getDbData, setDbData } from "@/utils";

export const dateToString = (date = Date.now()) => new Date(date).toISOString().split('T')[0]

export const getForms = async () => await getDbData({ location: "/forms" });
export const getFormIds = async () => Object.keys(await getForms());
export const getForm = async ({ formId }) => await getDbData({ location: `/forms/${formId}` });

export async function create() {

    const formId = uuid();
    const now = { date: dateToString() };

    await setDbData({
        location: `/forms/${formId}`,
        toStore: {
            creationDate: dateToString(),
            title: `title for ${formId}`,
            description: "",
            questions: [now, now, now],
            answers: []
        }
    });

    return formId;
}

export const deleteForm = async ({ formId }) => {
    setDbData({ location: `/forms/${formId}`, toStore: null })
}

export const updateFormField = ({ formId, field: { name, val } }) => {
    setDbData({ location: `/forms/${formId}/${name}`, toStore: val });
}

export const getQuestion = ({ questions, questionId }) => {
    return questions.find(({ id, date }) => id === questionId);
}

export const getRecipientAnswers = async ({ formId, recipientId }) => {
    const questions = await getDbData({ location: `/forms/${formId}/questions` })
    const answers = await getDbData({ location: `/forms/${formId}/answers/${recipientId}` })

    return answers.questions.map((item, i) => {
        const [questionId] = Object.keys(item);
        const { date } = getQuestion({ questions, questionId })
        return { id: questionId, date, answer: item[questionId] };
    });
}

