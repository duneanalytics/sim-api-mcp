import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as SimApi from "./sim";
import type { components } from "./Sim.types"; // Import generated types

const mockSuccessResponse = { success: true, data: {} };

describe("Sim API Client", () => {
  let fetchSpy: any;

  const expectFetchCalledWithHeaders = (url: string) => {
    expect(fetchSpy).toHaveBeenCalledWith(url, {
      headers: { "X-Sim-Api-Key": SimApi.SIM_API_KEY },
    });
  };

  beforeEach(() => {
    vi.stubEnv("SIM_API_KEY", SimApi.SIM_API_KEY);

    fetchSpy = vi.spyOn(global, "fetch");
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe("getBalances", () => {
    const address = "0xWalletAddress";
    const baseExpectedUrl = `https://api.sim.dune.com/v1/evm/balances/${address}`;
    const mockBalanceResponse: components["schemas"]["BalancesResponse"] = {
      balances: [
        {
          address: "native",
          amount: "605371497350928252303",
          chain: "ethereum",
          chain_id: 1,
          decimals: 18,
          price_usd: 3042.816964922323,
          symbol: "ETH",
          value_usd: 1842034.6622198338,
          low_liquidity: false,
          name: "Ethereum",
          pool_size: null,
          token_metadata: null,
        },
      ],
      next_offset:
        "dKMBWDLqM7vlyn5OMEXsLWp0nI4AAAABA5JLazNO7x4poVGqUwsgxgqvvIg",
      request_time: "2023-11-07T05:31:56Z",
      response_time: "2023-11-07T05:31:56Z",
      wallet_address: address,
    };

    it("should call fetch with the correct base URL and headers", async () => {
      await SimApi.getBalances(address);

      expect(fetchSpy).toHaveBeenCalledOnce();
      expectFetchCalledWithHeaders(baseExpectedUrl);
    });

    it("should correctly append chain_ids (array) to URL", async () => {
      const params = { chain_ids: ["1", "10"] };
      await SimApi.getBalances(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("chain_ids", "1,10");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });

    it("should correctly append chain_ids (string) to URL", async () => {
      const params = { chain_ids: "all" };
      await SimApi.getBalances(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("chain_ids", "all");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });

    it("should correctly exclude_spam to URL", async () => {
      const params = {
        exclude_spam_tokens: true,
      };
      await SimApi.getBalances(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("exclude_spam_tokens", "");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });

    it("should return the parsed JSON response", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBalanceResponse,
      } as Response);

      const result = await SimApi.getBalances(address);
      expect(result).toEqual(mockBalanceResponse);
    });
  });

  describe("getEVMTransactions", () => {
    const address = "0xAnotherWallet";
    const baseExpectedUrl = `https://api.sim.dune.com/v1/evm/transactions/${address}`;
    const mockTxResponse: components["schemas"]["TransactionsResponse"] = {
      next_offset: "AAYd_b6aoIAAAAABAAAAAA4KZhIAAAAAAAAAAAAAAAAAAAAE",
      transactions: [
        {
          address: address,
          block_hash:
            "0x6761509c675c0afd7737611513e39e4334c0f4ed176992d92c57d7cc296f9d58",
          block_number: 40517009,
          block_time: "2024-05-18T09:32:32+00:00",
          chain_id: 1,
          chain: "ethereum",
          data: "0x4e71d92d",
          from: address,
          gas_price: "0x62b85e900",
          hash: "0x029e21354ec2afad789c5fcd24987871d832b05b4159722a731d28141c2bd00f",
          index: 4,
          nonce: "0xd00b000000000000",
          to: "0x5857019c749147eee22b1fe63500f237f3c1b692",
          value: "0x0",
          logs: [],
          success: true,
          effective_gas_price: "0x62b85e900",
          gas_used: "21000",
          transaction_type: "Sender",
        },
      ],
    };

    it("should call fetch with the correct base URL", async () => {
      await SimApi.getEVMTransactions(address);
      expectFetchCalledWithHeaders(baseExpectedUrl);
    });

    it("should correctly append limit, after_block_number, after_timestamp, and tx_hash", async () => {
      const params = {
        limit: 10,
        after_block_number: 123456,
        after_timestamp: 1678880000,
        tx_hash: "0xTxHash",
      };
      await SimApi.getEVMTransactions(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("limit", "10");
      expectedUrl.searchParams.append("after_block_number", "123456");
      expectedUrl.searchParams.append("after_timestamp", "1678880000");
      expectedUrl.searchParams.append("tx_hash", "0xTxHash");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });

    it("should return the parsed JSON response", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTxResponse,
      } as Response);

      const result = await SimApi.getEVMTransactions(address);
      expect(result).toEqual(mockTxResponse);
    });
  });

  describe("getTokenPrice", () => {
    const contract_address = "0xTokenContract";
    const baseExpectedUrl = `https://api.sim.dune.com/beta/tokens/evm/${contract_address}`;
    const mockTokenPriceResponse: components["schemas"]["TokensResponse"] = {
      contract_address: contract_address,
      tokens: [
        {
          chain: "ethereum",
          chain_id: 1,
          price_usd: 1500.5,
          symbol: "WETH",
          decimals: 18,
          name: "Wrapped Ether",
        },
      ],
    };

    it("should call fetch with the correct base URL and default params", async () => {
      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("chain_ids", "all");

      await SimApi.getTokenPrice(contract_address);
      expectFetchCalledWithHeaders(expectedUrl.toString());
    });

    it("should correctly append chain_ids (array) to URL", async () => {
      const params = { chain_ids: ["1", "56"] };
      await SimApi.getTokenPrice(contract_address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("chain_ids", "1,56");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });

    it("should return the parsed JSON response", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenPriceResponse,
      } as Response);

      const result = await SimApi.getTokenPrice(contract_address);
      expect(result).toEqual(mockTokenPriceResponse);
    });
  });

  describe("listSupportedChainsTransactions", () => {
    const expectedUrl = `https://api.sim.dune.com/v1/evm/transactions/chains`;
    const mockSupportedChainsTxResponse: components["schemas"]["ChainsResponse"] =
      {
        chains: [
          {
            id: 8453,
            name: "base",
            tags: ["mainnet"],
          },
          {
            id: 1,
            name: "ethereum",
            tags: ["default", "mainnet"],
          },
        ],
      };

    it("should call fetch with the correct URL", async () => {
      await SimApi.listSupportedChainsTransactions();
      expectFetchCalledWithHeaders(expectedUrl);
    });
    it("should return the parsed JSON response for supported tx chains", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSupportedChainsTxResponse,
      } as Response);

      const result = await SimApi.listSupportedChainsTransactions();
      expect(result).toEqual(mockSupportedChainsTxResponse);
    });
  });

  describe("listSupportedChainsTokenBalances", () => {
    const expectedUrl = `https://api.sim.dune.com/v1/evm/balances/chains`;
    const mockSupportedChainsBalanceResponse: components["schemas"]["ChainsResponse"] =
      {
        chains: [
          {
            id: 42161,
            name: "arbitrum",
            tags: ["default", "mainnet"],
          },
          {
            id: 1,
            name: "ethereum",
            tags: ["default", "mainnet"],
          },
        ],
      };

    it("should call fetch with the correct URL", async () => {
      await SimApi.listSupportedChainsTokenBalances();
      expectFetchCalledWithHeaders(expectedUrl);
    });
    it("should return the parsed JSON response for supported balance chains", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSupportedChainsBalanceResponse,
      } as Response);

      const result = await SimApi.listSupportedChainsTokenBalances();
      expect(result).toEqual(mockSupportedChainsBalanceResponse);
    });
  });

  // --- SVM Tests ---

  describe("getSVMBalances", () => {
    const address = "So1anaAddress";
    const baseExpectedUrl = `https://api.sim.dune.com/beta/balances/svm/${address}`;
    const mockSvmBalanceResponse: components["schemas"]["BalancesResponse"] = {
      balances: [
        {
          address: "So11111111111111111111111111111111111111112",
          amount: "5000000000",
          chain: "solana",
          chain_id: 101,
          decimals: 9,
          low_liquidity: false,
          name: "Solana",
          pool_size: null,
          price_usd: 150.25,
          symbol: "SOL",
          token_metadata: null,
          value_usd: 751.25,
        },
      ],
      errors: null,
      next_offset: "someOffsetString",
      request_time: "2024-05-22T10:00:00Z",
      response_time: "2024-05-22T10:00:01Z",
      wallet_address: address,
    };

    it("should call fetch with the correct base URL", async () => {
      await SimApi.getSVMBalances(address);
      expectFetchCalledWithHeaders(baseExpectedUrl);
    });

    it("should correctly append mint_addresses and exclude_spam", async () => {
      const params = { mint_addresses: ["Mint1", "Mint2"], exclude_spam: true };
      await SimApi.getSVMBalances(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("mint_addresses", "Mint1,Mint2");
      expectedUrl.searchParams.append("exclude_spam", "true");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });
    it("should return the parsed JSON response for SVM balances", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSvmBalanceResponse,
      } as Response);

      const result = await SimApi.getSVMBalances(address);
      expect(result).toEqual(mockSvmBalanceResponse);
    });
  });

  describe("getSVMTransactions", () => {
    const address = "So1anaTxAddress";
    const baseExpectedUrl = `https://api.sim.dune.com/beta/transactions/svm/${address}`;
    const mockSvmTxResponse: components["schemas"]["TransactionsSvmResponse"] =
      {
        transactions: [
          {
            address: address,
            block_slot: 250000000,
            block_time: 1684756800,
            chain: "solana",
            raw_transaction: {},
          },
        ],
        next_offset: "nextOffsetString",
      };

    it("should call fetch with the correct base URL", async () => {
      await SimApi.getSVMTransactions(address);
      expectFetchCalledWithHeaders(baseExpectedUrl);
    });

    it("should correctly append limit, after_block_number, after_timestamp, and tx_hash", async () => {
      const params = {
        limit: 5,
        after_block_number: 1234,
        after_timestamp: 1678882000,
        tx_hash: "SolTxHash",
      };
      await SimApi.getSVMTransactions(address, params);

      const expectedUrl = new URL(baseExpectedUrl);
      expectedUrl.searchParams.append("limit", "5");
      expectedUrl.searchParams.append("after_block_number", "1234");
      expectedUrl.searchParams.append("after_timestamp", "1678882000");
      expectedUrl.searchParams.append("tx_hash", "SolTxHash");

      expect(fetchSpy).toHaveBeenCalledWith(
        expectedUrl.toString(),
        expect.anything()
      );
    });
    it("should return the parsed JSON response for SVM transactions", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSvmTxResponse,
      } as Response);

      const result = await SimApi.getSVMTransactions(address);
      expect(result).toEqual(mockSvmTxResponse);
    });
  });
});
