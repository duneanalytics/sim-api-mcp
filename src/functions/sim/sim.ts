import { SIM_API_KEY } from "../../config/components/sim";

export { SIM_API_KEY };

type EVMBalancesParams = {
  chain_ids?: string | string[]; 
  exclude_spam_tokens?: boolean; 
};

export async function getBalances(
  address: string,
  params: EVMBalancesParams = {}
) {
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
    url.searchParams.append("exclude_spam_tokens", "");
  }

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
  const url = new URL(
    `https://api.sim.dune.com/beta/tokens/evm/${contract_address}`
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

type EVMActivityParams = {
  chain_ids?: string | string[]; // specific chain IDs or "all"
  limit?: number; // number of activities to return
  after_block_number?: number; // fetch activities after this block
  after_timestamp?: number; // fetch activities after this timestamp
  tx_hash?: string; // filter by transaction hash
};

export async function getEVMActivity(
  address: string,
  params: EVMActivityParams = {}
) {
  const url = new URL(
    `https://api.sim.dune.com/beta/activity/evm/${address}`
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

export async function listSupportedChainsTransactions() {
  const response = await fetch(
    `https://api.sim.dune.com/v1/evm/transactions/chains`,
    {
      headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
      },
    }
  );
  return await response.json();
}

export async function listSupportedChainsTokenBalances() {
  const response = await fetch(
    `https://api.sim.dune.com/v1/evm/balances/chains`,
    {
      headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
      },
    }
  );
  return await response.json();
}

// SVM Endpoints

type SVMBalancesParams = {
  mint_addresses?: string[]; // specific token mints to fetch
  exclude_spam?: boolean; // exclude spam tokens
};

export async function getSVMBalances(
  address: string,
  params: SVMBalancesParams = {}
) {
  const url = new URL(
    `https://api.sim.dune.com/beta/balances/svm/${address}`
  );

  if (params.mint_addresses?.length) {
    url.searchParams.append("mint_addresses", params.mint_addresses.join(","));
  }

  if (params.exclude_spam !== undefined) {
    url.searchParams.append("exclude_spam", params.exclude_spam.toString());
  }

  const response = await fetch(url.toString(), {
    headers: {
      "X-Sim-Api-Key": SIM_API_KEY,
    },
  });
  return await response.json();
}

type SVMTransactionsParams = {
  limit?: number; // number of transactions to return
  after_block_number?: number; // fetch transactions after this block
  after_timestamp?: number; // fetch transactions after this timestamp
  tx_hash?: string; // filter by transaction hash
};

export async function getSVMTransactions(
  address: string,
  params: SVMTransactionsParams = {}
) {
  const url = new URL(
    `https://api.sim.dune.com/beta/transactions/svm/${address}`
  );

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
