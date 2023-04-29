import { render, screen } from "@testing-library/react";
import ArticleDetailsPage from "main/pages/Articles/ArticleDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        id: 3,
    }),
    useNavigate: () => mockNavigate,
}));

jest.mock("main/utils/articleUtils", () => {
    return {
        __esModule: true,
        articleUtils: {
            getById: (_id) => {
                return {
                    article: {
                        id: 3,
                        title: "Jessy Gonzalez for Internal Vice President",
                        image: "https://dailynexus.s3.us-west-1.amazonaws.com/dailynexus/wp-content/uploads/2023/04/20001430/Jessy-Gonzalez-headshot.-NishaMally_DailyNexus.jpg",
                        content:
                            "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate.",
                    },
                };
            },
        },
    };
});

describe("ArticleDetailsPage tests", () => {
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticleDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(
            screen.getByText("Jessy Gonzalez for Internal Vice President")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "https://dailynexus.s3.us-west-1.amazonaws.com/dailynexus/wp-content/uploads/2023/04/20001430/Jessy-Gonzalez-headshot.-NishaMally_DailyNexus.jpg"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "The Associated Students (A.S.) Internal Vice President (IVP) leads the Senate and serves as the representative for A.S. in all internal affairs. Given Gonzalez’s extensive history of legislation, student advocacy work and familiarity with senatorial processes, the Nexus believes that Gonzalez would impactfully restore function and efficiency through exceptional leadership to the 74th Senate."
            )
        ).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });
});
