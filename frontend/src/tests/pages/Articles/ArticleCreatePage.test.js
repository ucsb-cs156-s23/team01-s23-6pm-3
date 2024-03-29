import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ArticleCreatePage from "main/pages/Articles/ArticleCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/articleUtils', () => {
    return {
        __esModule: true,
        articleUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("ArticleCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /articles on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "article": {
                id: 3,
                title: "Jessy Gonzalez",
                image: "Jessy-Gonzalez-headshot",
                content: "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate."
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();


        const imageInput = screen.getByLabelText("Image");
        expect(imageInput).toBeInTheDocument();

        const contentInput = screen.getByLabelText("Content");
        expect(contentInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'Jessy Gonzalez' } })
            fireEvent.change(imageInput, { target: { value: 'Jessy-Gonzalez-headshot' } })
            fireEvent.change(contentInput, { target: { value: 'The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate.' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/articles"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdArticle: {"article":{"id":3,"title":"Jessy Gonzalez","image":"Jessy-Gonzalez-headshot","content":"The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate."}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


