import { useState } from "react";
import { useNavigate } from "react-router";
import { LoaderFunction, useLoaderData } from "react-router-typesafe";

import { deleteForm, getForms, getFormIds, create, duplicateForm } from "./forms";

import { Header } from "./Header";
import FormCard from "./FormCard";
import AddCard from "./AddCard";

export const loader = (async () => {
    const formIdsDefaults = await getFormIds();
    const formsDefaults = await getForms();
    return { formIdsDefaults, formsDefaults };
}) satisfies LoaderFunction

export const Workspace = () => {

    const { formIdsDefaults, formsDefaults } = useLoaderData<typeof loader>();
    const [formIds, setFormIds] = useState(formIdsDefaults);
    const [forms] = useState(formsDefaults);

    const navigate = useNavigate();

    const navigateToFormWithId = ({ formId }) => navigate("/workspace/form/" + formId)

    const handleNewForm = async () => {
        const formId = await create();
        navigateToFormWithId({ formId });
    };

    const handleFormDuplication = async ({ formId }) => {
        const _formId = await duplicateForm({ formId });
        navigateToFormWithId({ formId: _formId });
    }

    const handleDeleteForm = async ({ formId }) => {
        await deleteForm({ formId });
        setFormIds(await getFormIds());
    };

    const handleSearch = async (searchTerm) => {
        const formIds = await getFormIds();
        setFormIds(
            formIds.filter(
                formId => forms[formId].title?.toLowerCase()
                    .includes(searchTerm?.toLowerCase())
            )
        );
    };

    return (
        <section className="page">
            <Header onNewForm={handleNewForm} onSearch={handleSearch} />
            <ul className="p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6">
                {formIds.map((formId, i) => (
                    <FormCard
                        key={formId}
                        to={`/workspace/form/${formId}/`}
                        label={forms[formId].title}
                        onDuplicate={() => handleFormDuplication({ formId })}
                        onDelete={() => handleDeleteForm({ formId })} />
                ))}
                <AddCard onNewForm={handleNewForm} />
            </ul>
        </section>
    )
}