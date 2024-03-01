import React from 'react'

export interface MatchProps {
  when?: boolean
  children?: React.ReactNode | React.ReactNodeArray
}
export const Match: React.FC<MatchProps> = props => {
  return <>{props.when ? props.children : null}</>
}

export default Match
