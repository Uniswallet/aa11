import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@pancakeswap-libs/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import QuestionHelper from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../components/Shared'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import TranslatedText from '../../components/TranslatedText'
import { TranslateString } from '../../utils/translateTextHelpers'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'pool'} />
               <RowBetween padding={'8px 8px'}>
        <Text><QuestionHelper text="There is a 0.4975% withdrawal fee that goes to STAX stakers &amp; remaining LP providers to incentivise long term liquidity. STAX holders, depending on their STAX holdings, receive discounts and even fee-free withdrawals. See more on our Medium"></QuestionHelper>
        <span> </span> Fees | Warnings<QuestionHelper text="Our contracts have been audited, but users should always exercise caution when depositing funds. We will always act to protect our users, but by proceeding, you agree to DYOR and are responsible for any losses incurred while interacting with our product."></QuestionHelper>
</Text>
</RowBetween>
        
        
           
        
        
        <AutoColumn gap="lg" justify="center">
          <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 16 }} to="/add/BUSD">
            <Text fontWeight={500} fontSize={20} style={{ color: '#fff' }}>
              <TranslatedText translationId={100}>Add Liquidity</TranslatedText>
            </Text>
           
          </ButtonPrimary>
       

          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.colors.text1} fontWeight={500}>
                <TranslatedText translationId={102}>Your Liquidity</TranslatedText>
              </Text>
              
                
              
              <Question
                text={TranslateString(
                  130,
                  'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                )}
              />
            </RowBetween>

            {!account ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </LightCard>
            ) : v2IsLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </LightCard>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
              <LightCard padding="40px">
                <TYPE.body color={theme.colors.text3} textAlign="center">
                  <TranslatedText translationId={104}>No liquidity found.</TranslatedText>
                </TYPE.body>
              </LightCard>
            )}

            <div>
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : TranslateString(106, "Don't see a pool you joined?")}{' '}
                <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? 'Migrate now.' : TranslateString(108, 'Import it.')}
                </StyledInternalLink>
              </Text>
              
            <Text color={theme.colors.text1} fontWeight={500}>
               If you have WHALE liquidity provider tokens, you can deposit them for up to 400% APY on Pancakeswap.Finance!
               <span> ｜ </span>
               <a target="_blank" href="https://exchange.pancakeswap.finance/#/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0xBA2fbA507fF19260E5AB1a30c00D284901F1E7F3">
                 WHALE/BUSD </a>
                 <span> ｜ </span>
               <a target="_blank" href="https://exchange.pancakeswap.finance/#/add/0x55d398326f99059fF775485246999027B3197955/0xBA2fbA507fF19260E5AB1a30c00D284901F1E7F3">
                 WHALE/USDT </a>
                 <span> ｜ </span>
             <a target="_blank" href="https://exchange.pancakeswap.finance/#/add/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3/0xBA2fbA507fF19260E5AB1a30c00D284901F1E7F3">
                 WHALE/DAI </a>
                <span> ｜ </span>
               <a target="_blank" href="https://exchange.pancakeswap.finance/#/add/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/0xBA2fbA507fF19260E5AB1a30c00D284901F1E7F3">
                 WHALE/USDC </a>
                 
              </Text>
            </div>
          </AutoColumn>
        </AutoColumn>
      </AppBody>
    </>
  )
}
