import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ArticleTable, { showCell } from "main/components/Articles/ArticleTable";
import { articleFixtures } from "fixtures/articleFixtures";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("ArticleTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "Title", "Image", "Content"];
    const expectedFields = ["id", "title", "image", "content"];
    const testId = "ArticleTable";

    test("showCell function works properly", () => {
        const cell = {
            row: {
                values: { a: 1, b: 2, c: 3 },
            },
        };
        expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
    });

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable articles={[]} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers, content and buttons", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable articles={articleFixtures.threeArticles} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(
                `${testId}-cell-row-0-col-${field}`
            );
            expect(header).toBeInTheDocument();
        });

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-title`)
        ).toHaveTextContent(
            "Interactive Learning Pavilion delivers first new classrooms in 50 years"
        );

        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-id`)
        ).toHaveTextContent("3");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-title`)
        ).toHaveTextContent("Jessy Gonzalez for Internal Vice President");

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();
        expect(detailsButton).toHaveClass("btn-primary");

        const editButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Edit-button`
        );
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Delete-button`
        );
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Has the expected column headers, content and no buttons when showButtons=false", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable
                        articles={articleFixtures.threeArticles}
                        showButtons={false}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(
                `${testId}-cell-row-0-col-${field}`
            );
            expect(header).toBeInTheDocument();
        });

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-title`)
        ).toHaveTextContent(
            "Interactive Learning Pavilion delivers first new classrooms in 50 years"
        );

        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-id`)
        ).toHaveTextContent("3");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-title`)
        ).toHaveTextContent("Jessy Gonzalez for Internal Vice President");

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });
    test("Edit button navigates to the edit page", async () => {
        // arrange
        const restoreConsole = mockConsole();

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable articles={articleFixtures.threeArticles} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-title`)
        ).toHaveTextContent(
            "Interactive Learning Pavilion delivers first new classrooms in 50 years"
        );

        const editButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Edit-button`
        );
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/articles/edit/2")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `editCallback: {"id":2,"title":"Interactive Learning Pavilion delivers first new classrooms in 50 years","image":"https://dailynexus.s3.us-west-1.amazonaws.com/dailynexus/wp-content/uploads/2023/04/19232553/MaddyFangio-1975.jpg","content":"The building provides 2,000 seats of classroom space, increasing the university’s classroom capacity by 35%, according to The Current. The Interactive Learning Pavilion (ILP) also features two student lounges on the third and fourth floors, power outlets under outdoor handrail tables and under lecture hall tables and lecture hall desks that rotate 180 degrees to encourage group collaboration."})`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });

    test("Details button navigates to the details page", async () => {
        // arrange
        const restoreConsole = mockConsole();

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable articles={articleFixtures.threeArticles} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-title`)
        ).toHaveTextContent(
            "Interactive Learning Pavilion delivers first new classrooms in 50 years"
        );

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();

        // act - click the details button
        fireEvent.click(detailsButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/articles/details/2")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `detailsCallback: {"id":2,"title":"Interactive Learning Pavilion delivers first new classrooms in 50 years","image":"https://dailynexus.s3.us-west-1.amazonaws.com/dailynexus/wp-content/uploads/2023/04/19232553/MaddyFangio-1975.jpg","content":"The building provides 2,000 seats of classroom space, increasing the university’s classroom capacity by 35%, according to The Current. The Interactive Learning Pavilion (ILP) also features two student lounges on the third and fourth floors, power outlets under outdoor handrail tables and under lecture hall tables and lecture hall desks that rotate 180 degrees to encourage group collaboration."})`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });

    test("Delete button calls delete callback", async () => {
        // arrange
        const restoreConsole = mockConsole();

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleTable articles={articleFixtures.threeArticles} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-title`)
        ).toHaveTextContent(
            "Interactive Learning Pavilion delivers first new classrooms in 50 years"
        );

        const deleteButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Delete-button`
        );
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);

        // assert - check that the console.log was called with the expected message
        await waitFor(() => expect(console.log).toHaveBeenCalled());
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `deleteCallback: {"id":2,"title":"Interactive Learning Pavilion delivers first new classrooms in 50 years","image":"https://dailynexus.s3.us-west-1.amazonaws.com/dailynexus/wp-content/uploads/2023/04/19232553/MaddyFangio-1975.jpg","content":"The building provides 2,000 seats of classroom space, increasing the university’s classroom capacity by 35%, according to The Current. The Interactive Learning Pavilion (ILP) also features two student lounges on the third and fourth floors, power outlets under outdoor handrail tables and under lecture hall tables and lecture hall desks that rotate 180 degrees to encourage group collaboration."})`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});
