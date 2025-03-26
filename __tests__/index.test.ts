import axios from "axios";
import { handleToolCall } from "../index.js";

describe("handleToolCall", () => {
  const baseUrl = "https://frontend-api-v3.pump.fun/coins";

  it("should fetch featured coins successfully", async () => {
	const data = { offset: 0, limit:24, includeNsfw: true };
    const result = await handleToolCall("get_featured_coins", data);

    expect(result.isError).toEqual(false);
  });

  it("should fetch coins successfully", async () => {
	const data = { offset: 0, limit:24, includeNsfw: true, sort: "market_cap", order: "DESC" };
    const result = await handleToolCall("get_coins", data);
    
	expect(result.isError).toEqual(false);
  });

  it("should fetch coin info successfully", async () => {
	const data = { mintId: "J1Wpmugrooj1yMyQKrdZ2vwRXG5rhfx3vTnYE39gpump" };
	const result = await handleToolCall("get_coin_info", data);

	expect(result.isError).toEqual(false);
  });

  it("should return error on unknown tool", async () => {
    const result = await handleToolCall("unknown_tool", {});
    
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Unknown tool");
  });

  it("should handle API failure gracefully", async () => {
    const result = await handleToolCall("get_coins", {});
    expect(result.isError).toEqual(true);
  });
});