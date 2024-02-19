const ethers = require("ethers");

const swapper_abi =
  require("../artifacts/contracts/swapper.sol/Uniswapper.json").abi;
const swapper_adderss = "0xf229F65C7b2a4258a04597E4B4e25879F029c633";

const routerContractAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";

async function autoBuy(tokenAAddress, privateKey, amountToBuy, numberOfBuys) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://go.getblock.io/bf632a41f0844f2ab964a7601bf190ca"
  );
  const wallet = new ethers.Wallet(privateKey, provider);

  const swapperContract = new ethers.Contract(
    swapper_adderss,
    swapper_abi,
    wallet
  );

  let buysRemaining = numberOfBuys;

  filter = {
    address: routerContractAddress,
    topics: [
      // the name of the event, parnetheses containing the data type of each event, no spaces
      utils.id("Transfer(address,address,uint256)"),
    ],
  };
  provider.on(filter, () => {
    // do whatever you want here
    // I'm pretty sure this returns a promise, so don't forget to resolve it
  });

  provider.on(filter, async () => {
    console.log("liqyuidity added, buying tokens...");
    if (buysRemaining > 0) {
      const amountIn = ethers.utils.parseEther(amountToBuy.toString()); // Amount of BNB to spend
      const amountOutMin = 0; // Minimum amount of tokens to buy
      const path = [ethers.constants.AddressZero, tokenAAddress]; // Path for the swap
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      const result = await swapperContract.swapBNBForTokenA(
        to,
        _tokenA,
        amountIn,
        amountOutMin,
        deadline,
        { value: amountIn }
      );

      await result.wait();
      console.log("WAITING FOR RESU", result.hash);

      console.log("Bought tokens", result.hash);

      buysRemaining--;

      console.log("Buys remaining", buysRemaining);
    } else {
      console.log("No buys remaining, limit reached. Stopping.");
    }
  });
}

// you can specify the arguments here
const constracAddress = "0xf229F65C7b2a4258a04597E4B4e25879F029c633";
const privateKey =
  "43192bb03bc7c2f56e6690a6e9d2084a86d0654fd579a39a8a14f2efc7c59823";
const amountToBuy = 0.001;
const numberOfBuys = 2;
// Usage:
autoBuy(constracAddress, privateKey, amountToBuy, numberOfBuys);
