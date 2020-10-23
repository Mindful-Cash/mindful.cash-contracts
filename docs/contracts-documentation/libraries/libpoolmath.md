# `LibPoolMath`

## Functions:

- `calcSpotPrice(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 swapFee) (internal)`

- `calcOutGivenIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountIn, uint256 swapFee) (internal)`

- `calcInGivenOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountOut, uint256 swapFee) (internal)`

- `calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee) (internal)`

- `calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee) (internal)`

- `calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee) (internal)`

- `calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee) (internal)`

- `calcTokensForAmount(uint256 _amount) (external)`

- `calcPoolOutGivenSingleIn(address _token, uint256 _amount) (external)`

- `calcSingleInGivenPoolOut(address _token, uint256 _amount) (external)`

- `calcSingleOutGivenPoolIn(address _token, uint256 _amount) (external)`

- `calcPoolInGivenSingleOut(address _token, uint256 _amount) (external)`

### Function `calcSpotPrice(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 swapFee) → uint256 spotPrice internal`

********************************************************************************************

// calcSpotPrice                                                                             //

// sP = spotPrice                                                                            //

// bI = tokenBalanceIn                ( bI / wI )         1                                  //

// bO = tokenBalanceOut         sP =  -----------  *  ----------                             //

// wI = tokenWeightIn                 ( bO / wO )     ( 1 - sF )                             //

// wO = tokenWeightOut                                                                       //

// sF = swapFee                                                                              //*********************************************************************************************

### Function `calcOutGivenIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountIn, uint256 swapFee) → uint256 tokenAmountOut internal`

********************************************************************************************

// calcOutGivenIn                                                                            //

// aO = tokenAmountOut                                                                       //

// bO = tokenBalanceOut                                                                      //

// bI = tokenBalanceIn              /      /            bI             \    (wI / wO) \      //

// aI = tokenAmountIn    aO = bO * |  1 - | --------------------------  | ^            |     //

// wI = tokenWeightIn               \      \ ( bI + ( aI * ( 1 - sF )) /              /      //

// wO = tokenWeightOut                                                                       //

// sF = swapFee                                                                              //*********************************************************************************************

### Function `calcInGivenOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 tokenAmountOut, uint256 swapFee) → uint256 tokenAmountIn internal`

********************************************************************************************

// calcInGivenOut                                                                            //

// aI = tokenAmountIn                                                                        //

// bO = tokenBalanceOut               /  /     bO      \    (wO / wI)      \                 //

// bI = tokenBalanceIn          bI * |  | ------------  | ^            - 1  |                //

// aO = tokenAmountOut    aI =        \  \ ( bO - aO ) /                   /                 //

// wI = tokenWeightIn           --------------------------------------------                 //

// wO = tokenWeightOut                          ( 1 - sF )                                   //

// sF = swapFee                                                                              //*********************************************************************************************

### Function `calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee) → uint256 poolAmountOut internal`

********************************************************************************************

// calcPoolOutGivenSingleIn                                                                  //

// pAo = poolAmountOut         /                                              \              //

// tAi = tokenAmountIn        ///      /     //    wI \      \\       \     wI \             //

// wI = tokenWeightIn        //| tAi *| 1 - || 1 - --  | * sF || + tBi \    --  \            //

// tW = totalWeight     pAo=||  \      \     \\    tW /      //         | ^ tW   | * pS - pS //

// tBi = tokenBalanceIn      \\  ------------------------------------- /        /            //

// pS = poolSupply            \\                    tBi               /        /             //

// sF = swapFee                \                                              /              //*********************************************************************************************

### Function `calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee) → uint256 tokenAmountIn internal`

********************************************************************************************

// calcSingleInGivenPoolOut                                                                  //

// tAi = tokenAmountIn              //(pS + pAo)\     /    1    \\                           //

// pS = poolSupply                 || ---------  | ^ | --------- || * bI - bI                //

// pAo = poolAmountOut              \\    pS    /     \(wI / tW)//                           //

// bI = balanceIn          tAi =  --------------------------------------------               //

// wI = weightIn                              /      wI  \                                   //

// tW = totalWeight                      1 - |  1 - ----  |  * sF                            //

// sF = swapFee                               \      tW  /                                   //*********************************************************************************************

### Function `calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee) → uint256 tokenAmountOut internal`

********************************************************************************************

// calcSingleOutGivenPoolIn                                                                  //

// tAo = tokenAmountOut            /      /                                             \\   //

// bO = tokenBalanceOut           /      // pS - (pAi * (1 - eF)) \     /    1    \      \\  //

// pAi = poolAmountIn            | bO - || ----------------------- | ^ | --------- | * b0 || //

// ps = poolSupply                \      \\          pS           /     \(wO / tW)/      //  //

// wI = tokenWeightIn      tAo =   \      \                                             //   //

// tW = totalWeight                    /     /      wO \       \                             //

// sF = swapFee                    *  | 1 - |  1 - ---- | * sF  |                            //

// eF = exitFee                        \     \      tW /       /                             //*********************************************************************************************

### Function `calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee) → uint256 poolAmountIn internal`

********************************************************************************************

// calcPoolInGivenSingleOut                                                                  //

// pAi = poolAmountIn               // /               tAo             \\     / wO \     \   //

// bO = tokenBalanceOut            // | bO - -------------------------- |\   | ---- |     \  //

// tAo = tokenAmountOut      pS - ||   \     1 - ((1 - (tO / tW)) * sF)/  | ^ \ tW /  * pS | //

// ps = poolSupply                 \\ -----------------------------------/                /  //

// wO = tokenWeightOut  pAi =       \\               bO                 /                /   //

// tW = totalWeight           -------------------------------------------------------------  //

// sF = swapFee                                        ( 1 - eF )                            //

// eF = exitFee                                                                              //*********************************************************************************************

### Function `calcTokensForAmount(uint256 _amount) → address[] tokens, uint256[] amounts external`

Gets the underlying assets and amounts to mint specific pool shares.

#### Parameters:

- `_amount`: Amount of pool shares to calculate the values for

#### Return Values:

- tokens The addresses of the tokens

- amounts The amounts of tokens needed to mint that amount of pool shares

### Function `calcPoolOutGivenSingleIn(address _token, uint256 _amount) → uint256 external`

Calculate the amount of pool tokens out for a given amount in

#### Parameters:

- `_token`: Address of the input token

- `_amount`: Amount of input token

#### Return Values:

- Amount of pool token

### Function `calcSingleInGivenPoolOut(address _token, uint256 _amount) → uint256 external`

Calculate single in given pool out

#### Parameters:

- `_token`: Address of the input token

- `_amount`: Amount of pool out token

#### Return Values:

- Amount of token in

### Function `calcSingleOutGivenPoolIn(address _token, uint256 _amount) → uint256 external`

Calculate single out given pool in

#### Parameters:

- `_token`: Address of output token

- `_amount`: Amount of pool in

#### Return Values:

- Amount of token in

### Function `calcPoolInGivenSingleOut(address _token, uint256 _amount) → uint256 external`

Calculate pool in given single token out

#### Parameters:

- `_token`: Address of output token

- `_amount`: Amount of output token

#### Return Values:

- Amount of pool in
