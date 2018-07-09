import styled from 'styled-components'

const SideBar = styled.div`
    width: 20px;
    height: 100%;
    background-color: #121212;
    transition: all 200ms ease;
    overflow: hidden;
    color: #fff;
    transition: all 200ms ease;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &:hover {
        width: 300px;
    }
`

export default SideBar
