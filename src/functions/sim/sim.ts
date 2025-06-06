import { SIM_API_KEY } from "../../config/components/sim";

export { SIM_API_KEY };

// Helper function to validate API key
function validateApiKey() {
  if (!SIM_API_KEY || SIM_API_KEY.trim() === "") {
    throw new Error("SIM_API_KEY is missing. Please set the SIM_API_KEY environment variable with your Sim API key.");
  }
}

type EVMBalancesParams = {
  chain_ids?: string | string[]; 
  exclude_spam_tokens?: boolean; 
  limit?: number; // maximum number of tokens to return
};

export async function getBalances(
  address: string,
  params: EVMBalancesParams = {}
) {
  validateApiKey();
  
  const url = new URL(
    `https://api.sim.dune.com/v1/evm/balances/${address}`
  );

  if (params.chain_ids) {
    if (Array.isArray(params.chain_ids)) {
      url.searchParams.append("chain_ids", params.chain_ids.join(","));
    } else {
      url.searchParams.append("chain_ids", params.chain_ids);
    }
  }

  if (params.exclude_spam_tokens !== undefined) {
    url.searchParams.append("exclude_spam_tokens", params.exclude_spam_tokens.toString());
  }

  const limit = params.limit !== undefined ? params.limit : 20;
  url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}

type EVMTransactionsParams = {
  chain_ids?: string | string[]; // specific chain IDs or "all"
  limit?: number; // number of transactions to return
  after_block_number?: number; // fetch transactions after this block
  after_timestamp?: number; // fetch transactions after this timestamp
  tx_hash?: string; // filter by transaction hash
};

export async function getEVMTransactions(
  address: string,
  params: EVMTransactionsParams = {}
) {
  validateApiKey();
  
  const url = new URL(
    `https://api.sim.dune.com/v1/evm/transactions/${address}`
  );

  if (params.chain_ids) {
    if (Array.isArray(params.chain_ids)) {
      url.searchParams.append("chain_ids", params.chain_ids.join(","));
    } else {
      url.searchParams.append("chain_ids", params.chain_ids);
    }
  }

  if (params.limit !== undefined) {
    url.searchParams.append("limit", params.limit.toString());
  }

  if (params.after_block_number !== undefined) {
    url.searchParams.append(
      "after_block_number",
      params.after_block_number.toString()
    );
  }

  if (params.after_timestamp !== undefined) {
    url.searchParams.append(
      "after_timestamp",
      params.after_timestamp.toString()
    );
  }

  if (params.tx_hash) {
    url.searchParams.append("tx_hash", params.tx_hash);
  }

  const response = await fetch(url.toString(), {
    headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}

type EVMTokenParams = {
  chain_ids?: string | string[]; // specific chain IDs or "all"
};

export async function getTokenPrice(
  contract_address: string,
  params: EVMTokenParams = { chain_ids: "all" }
) {
  validateApiKey();
  
  const url = new URL(
    `https://api.sim.dune.com/v1/evm/token-info/${contract_address}`
  );

  if (params.chain_ids) {
    if (Array.isArray(params.chain_ids)) {
      url.searchParams.append("chain_ids", params.chain_ids.join(","));
    } else {
      url.searchParams.append("chain_ids", params.chain_ids);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}

export async function listSupportedChainsTransactions() {
  validateApiKey();
  
  const response = await fetch(
    `https://api.sim.dune.com/v1/evm/transactions/chains`,
    {
      headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
      },
    }
  );
  const result = await response.json();
  return result;
}

export async function listSupportedChainsTokenBalances() {
  validateApiKey();
  
  const response = await fetch(
    `https://api.sim.dune.com/v1/evm/balances/chains`,
    {
      headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
      },
    }
  );
  const result = await response.json();
  return result;
}

// SVM Endpoints

type SVMBalancesParams = {
  chains?: string; 
  limit?: number;
  offset?: string;
};

export async function getSVMBalances(
  address: string,
  params: SVMBalancesParams = {}
) {
  validateApiKey();
  
  const url = new URL(
    `https://api.sim.dune.com/beta/svm/balances/${address}`
  );

  if (params.chains) {
    url.searchParams.append("chains", params.chains);
  }

  if (params.limit !== undefined) {
    url.searchParams.append("limit", params.limit.toString());
  }

  if (params.offset) {
    url.searchParams.append("offset", params.offset);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}

type SVMTransactionsParams = {
  limit?: number; // maximum number of results to return
  offset?: string; // pagination offset from previous response
};

export async function getSVMTransactions(
  address: string,
  params: SVMTransactionsParams = {}
) {
  validateApiKey();
  
  const url = new URL(
    `https://api.sim.dune.com/beta/svm/transactions/${address}`
  );

  if (params.limit !== undefined) {
    url.searchParams.append("limit", params.limit.toString());
  }

  if (params.offset) {
    url.searchParams.append("offset", params.offset);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}
