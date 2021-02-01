import { ChainId } from '@pancakeswap-libs/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logow from '../../assets/images/stax_w.png'
import Logob from '../../assets/images/stax_b.png'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
// import Nav from './Nav'
import ThemeSwitch from './ThemeSwitch'
import { useIsDarkMode } from '../../state/user/hooks'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 600px;
  /* top: 0;
  position: absolute; */
  margin: 0 auto;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 320px) {
    width: 20%;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  text-decoration: none;
  font-family: 'Kaushan Script', sans-serif;
  font-weight: 900;
  /* color: #333; */
  color: ${({ theme }) => theme.colors.text1};
  :hover {
    cursor: pointer;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.colors.bg1 : theme.colors.bg3)};
  border-radius: 0;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 0;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  margin-right: 10px;
  :hover {
    transform: rotate(-5deg);
  }
  img {
    height: 2.5rem;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img {
      height: 2rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.BSCTESTNET]: 'Bsc-testnet'
}

export default function Header() {
  const isDark = useIsDarkMode()
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href="https://whaleswap.finance/">
            <UniIcon>{!isDark ? <img src={Logow} alt="logo" /> : <img src={Logob} alt="logo" />}</UniIcon>
            WhaleSwap
          </Title>
        </HeaderElement>
        <HeaderElement>
<UniIcon>*</UniIcon>
          <Title target="_blank" href="https://farm.whaleswap.finance/">
            Farm
          </Title>
        </HeaderElement>

        {/* <Nav /> */}
        <HeaderControls>
          {!isMobile && <ThemeSwitch />}
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} BNB
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {/* {isMobile && <ThemeSwitch />} */}

            <Settings />
            {/* <Menu /> */}
            {/* <LanguageSelectMenu /> */}
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
