import { Component } from 'react'

// eslint-disable-next-line import/no-default-export
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      return <h1>Algo deu errado.</h1>
    }
    return children
  }
}
