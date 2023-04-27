import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from "@testing-library/react";
import ArticleCreatePage from "main/pages/Articles/ArticleCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockAdd = jest.fn();
jest.mock("main/utils/articleUtils", () => {
    return {
        __esModule: true,
        articleUtils: {
            add: () => {
                return mockAdd();
            },
        },
    };
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
            article: {
                id: 3,
                name: "South Coast Deli",
                description: "Sandwiches and Salads",
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, {
                target: { value: "South Coast Deli" },
            });
            fireEvent.change(descriptionInput, {
                target: { value: "Sandwiches and Salads" },
            });
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/articles")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `createdArticle: {"article":{"id":3,"name":"South Coast Deli","description":"Sandwiches and Salads"}`;

        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});
