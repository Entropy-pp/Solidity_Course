const {ethers} = require("hardhat")

async function main(){
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("Deploying FundMe contract...")

    // deploy contract
    const fundMe = await fundMeFactory.deploy(3000)

    console.log("Waiting for 5 block...")
    console.log(`FundMe deployed to: ${fundMe.target}`)

    // wait for deployment
    if(hre.network.config.chainId === 11155111 && process.env.APIKEY){
        const txResponse = await fundMe.deploymentTransaction()
        await txResponse.wait(5)  
        await verifyContract(fundMe.target, 3000)
    }else{
        console.log("Skipping contract verification")
    }

    // init account
    const [firstAccount, secondAccount] = await ethers.getSigners()

    // fund the contract
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")})
    await fundTx.wait(1)

    // check balance
    const provider = ethers.provider
    const balance = await provider.getBalance(fundMe.target)
    console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`)

    // fund the contract with another account
    const fundTx2 = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.5")})
    await fundTx2.wait(1)

    // check balance again
    const balance2 = await provider.getBalance(fundMe.target)
    console.log(`Contract balance after second fund: ${ethers.formatEther(balance2)} ETH`)

    // check mapping
    const ba1 = await fundMe.fundersToAmount(firstAccount.address)
    const ba2 = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`First account balance: ${ethers.formatEther(ba1)} ETH`)
    console.log(`Second account balance: ${ethers.formatEther(ba2)} ETH`)
}

async function verifyContract(fundMe, args) {
    await hre.run("verify:verify", {
        address: fundMe,
        constructorArguments: [args],
    });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})

