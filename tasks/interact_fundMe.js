const{task} = require("hardhat/config");

task("interact_fundMe")
    .addParam("addr","fundme contract address")
    .setAction(async (taskArgs, hre) => {
        const fundMefactory = await hre.ethers.getContractFactory("FundMe")
        console.log("Interacting with FundMe contract...")
        const fundMe = await fundMefactory.attach(taskArgs.addr)
        
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
})

