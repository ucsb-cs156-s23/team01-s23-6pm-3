import { render, screen, waitFor } from "@testing-library/react";
import SongIndexPage from "main/pages/Songs/SongIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/songUtils', () => {
    return {
        __esModule: true,
        songUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    songs: [
                        {
                            "id": 3,
                            "name": "Freebirds",
                            "address": "879 Embarcadero del Norte",
                            "city": "Isla Vista",
                            "state": "CA",
                            "zip": "93117",
                            "description": "Burrito joint, and iconic Isla Vista location"
                        },
                    ]
                }
            }
        }
    }
});


describe("SongIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createSongButton = screen.getByText("Create Song");
        expect(createSongButton).toBeInTheDocument();
        expect(createSongButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Freebirds");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Burrito joint, and iconic Isla Vista location");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("SongTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("SongTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("SongTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SongIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Freebirds");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Burrito joint, and iconic Isla Vista location");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("SongTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/songs"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `SongIndexPage deleteCallback: {"id":3,"name":"Freebirds","description":"Burrito joint, and iconic Isla Vista location"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


