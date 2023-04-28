import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ArticleForm({
    initialContents,
    submitAction,
    buttonLabel = "Create",
}) {
    const navigate = useNavigate();

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialContents || {} });
    // Stryker enable all

    const testIdPrefix = "ArticleForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-title"}
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required.",
                        maxLength: {
                            value: 30,
                            message: "Max length 30 characters",
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="Image">Image</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-Image"}
                    id="Image"
                    type="text"
                    isInvalid={Boolean(errors.Image)}
                    {...register("Image", {
                        required: "Image is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.Image?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="content">Content</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-content"}
                    id="content"
                    type="text"
                    isInvalid={Boolean(errors.content)}
                    {...register("content", {
                        required: "Content is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.content?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid={testIdPrefix + "-submit"}>
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
        </Form>
    );
}

export default ArticleForm;
