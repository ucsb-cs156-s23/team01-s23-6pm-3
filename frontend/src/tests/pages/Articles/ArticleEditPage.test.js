import {
    render,
    screen,
    act,
    waitFor,
    fireEvent,
} from "@testing-library/react";
import ArticleEditPage from "main/pages/Articles/ArticleEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        id: 3,
    }),
    useNavigate: () => mockNavigate,
}));

const mockUpdate = jest.fn();
jest.mock("main/utils/articleUtils", () => {
    return {
        __esModule: true,
        articleUtils: {
            update: (_article) => {
                return mockUpdate();
            },
            getById: (_id) => {
                return {
                    article: {
                        id: 3,
                        title: "Jessy Gonzalez",
                        image: "Jessy-Gonzalez-headshot",
                        content:
                            "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate.",
                    },
                };
            },
        },
    };
});

describe("ArticleEditPage tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("ArticleForm-title")).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(
                "Jessy Gonzalez"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(
                "Jessy-Gonzalez-headshot"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(
                "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate."
            )
        ).toBeInTheDocument();
    });

    test("redirects to /articles on submit", async () => {
        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            article: {
                id: 3,
                title: "Jacob Eisner",
                image: "2019/04/AS-Election-Results",
                content:
                    "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Eisner would impactfully restore function and efficiency through exceptional leadership to the 74th Senate.",
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();

        const imageInput = screen.getByLabelText("Image");
        expect(imageInput).toBeInTheDocument();

        const contentInput = screen.getByLabelText("Content");
        expect(contentInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, {
                target: { value: "Jacob Eisner" },
            });
            fireEvent.change(imageInput, {
                target: {
                    value: "2019/04/AS-Election-Results",
                },
            });
            fireEvent.change(contentInput, {
                target: {
                    value: "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Eisner would impactfully restore function and efficiency through exceptional leadership to the 74th Senate.",
                },
            });
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/articles")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `updatedArticle: {"article":{"id":3,"title":"Jacob Eisner","image":"2019/04/AS-Election-Results","content":"The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Eisner would impactfully restore function and efficiency through exceptional leadership to the 74th Senate."}`;

        expect(message).toMatch(expectedMessage);
        restoreConsole();
    });
});
