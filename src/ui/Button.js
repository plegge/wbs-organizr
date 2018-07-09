import styled from 'styled-components'

const Button = styled.button`
    font-size: 1em;
    padding: 0.5em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
    box-sizing: border-box;

    transition: all 200ms ease;

    background: transparent;
    color: palevioletred;

    &:hover {
        color: white;
        background: palevioletred;
    }
`

export default Button
