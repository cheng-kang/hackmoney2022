import { Database } from './server';
import { ethers } from 'ethers';
import { Provider, Contract } from 'zksync-web3';
import RESOLVER_CONTRACT_ABI from './resolver_abi.json';
import { ETH_COIN_TYPE } from './utils';

export class ZksyncDatabase implements Database {
  resolverContract: Contract;
  ttl: number;

  constructor(contractAddress: string, ttl: number) {
    this.resolverContract = new Contract(
      contractAddress,
      RESOLVER_CONTRACT_ABI,
      new Provider('https://zksync2-testnet.zksync.dev')
    );
    this.ttl = ttl;
  }

  async addr(name: string, coinType: number = ETH_COIN_TYPE) {
    const res = await this.resolverContract.functions['addr(bytes32,uint256)'](
      ethers.utils.namehash(name),
      coinType
    );
    return { addr: res[0], ttl: this.ttl };
  }

  async text(name: string, key: string) {
    const res = await this.resolverContract.text(
      ethers.utils.namehash(name),
      key
    );
    return { value: res, ttl: this.ttl };
  }

  async contenthash(name: string) {
    const res = await this.resolverContract.contenthash(
      ethers.utils.namehash(name)
    );
    return { contenthash: res, ttl: this.ttl };
  }
}
