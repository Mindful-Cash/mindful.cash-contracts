// Add INFURA_API_KEY, KOVAN_PRIVATE_KEY and KOVAN_PRIVATE_KEY_SECONDARY to .env
// Run npx buidler run --network kovan scripts/deploy.js

async function main() {
    // We get the contract to deploy
    const MindfulProxy = await ethers.getContractFactory("MindfulProxy");
    const mindfulProxy = await MindfulProxy.deploy();

    await mindfulProxy.deployed();

    console.log("MindfulProxy deployed to:", mindfulProxy.address);
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});
