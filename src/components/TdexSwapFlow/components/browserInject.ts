import { BrowserInject, IdentityOpts, AddressInterface, address } from 'ldk';
import { MarinaProvider } from 'marina-provider';

export default class BrowserInjectOpenDex extends BrowserInject {
  private _provider: MarinaProvider;


  constructor(args: IdentityOpts) {
    super(args);
    this._provider = (window as any)[args.value.windowProvider];
  }

  async getBlindingPrivateKey(script: string): Promise<string> {
    try {
      // get addresses from marina
      const addresses = await this._provider.getAddresses();

      // find the address of the requested script
      let found: AddressInterface | undefined;
      addresses.forEach((addr: AddressInterface) => {
        const currentScript = address
          .toOutputScript(addr.confidentialAddress)
          .toString('hex');
        if (currentScript === script) {
          found = addr;
        }
      });

      if (!found)
        throw new Error("no blinding key for script " + script);

      return found.blindingPrivateKey;
    } catch (e) {
      throw e;
    }
  }
}