import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { rest } from "msw";
import { setupServer } from "msw/node";
import catsMock from "../../../mocks/cats.json";
import Pets from "../Pets";

//mocking->faking

const server = setupServer(
  rest.get("http://localhost:4000/cats", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(catsMock));
  })
);

describe("Test Pets Component", () => {
  beforeEach(() => {
    render(<Pets />);
  });

  beforeAll(() => server.listen());

  // Reset handlers so that each test could alter them
  // without affecting other, unrelated tests.
  afterEach(() => server.resetHandlers());

  // Don't forget to clean up afterwards.
  afterAll(() => server.close());

  test("Test Render initial 5 cards of cats", async () => {
    const cards = await screen.findAllByRole("article");
    expect(cards.length).toBe(5);
  });
  test('Test it should render only female cats after filter by female gender',async()=>{
    const cards = await screen.findAllByRole("article");
    userEvent.selectOptions(screen.getByLabelText(/Gender/i),'female')
    expect(screen.getAllByRole('article').length).toBe(3)
    expect(screen.getAllByRole('article')).toStrictEqual([cards[0],cards[2],cards[4]])

    // screen.getByLabelText(/Gender/i)
  })
  
  
  test('Test it should render only favoured  cats after filter by Favorite',async()=>{
    const cards = await screen.findAllByRole("article");
    userEvent.selectOptions(screen.getByLabelText(/Favourite/i),'Favoured')
    expect(screen.getAllByRole('article').length).toBe(2)
    expect(screen.getAllByRole('article')).toStrictEqual([cards[0],cards[1]])

  })
});
