import { Box } from "@chakra-ui/react"
import { H3 } from "@/components/wizard"
import { colors } from "@/styles/defaultTheme"
import styled from "@emotion/styled"

export const ComingSoon = () => {
  const num = new Date().getHours() % 6
  return (
    <Box>
      <H3 align="center"> COMING SOON</H3>
      <SoonHero backgroundImage={`bg/bg_${num + 1}.png`} />
    </Box>
  )
}

const SoonHero = styled(Box)`
  background-color: skyblue;
  background-position: center;
  background-size: cover;
  margin: 0 auto;
  width: 100%;
  height: 400px;
  box-shadow: inset 0px 0px 6px 6px ${colors.brand.primary};
`
