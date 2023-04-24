import styled from 'styled-components'

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

export const TableHeader = styled.th`
  background-color: #d3d3d3;
  border: 1px solid #ddd;
  color: #000;
  padding: 8px;
  text-align: center;
`

export const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`

export const Label = styled.label`
  display: block;
  margin-bottom: 4px;
`

export const Input = styled.input`
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #1d1d1d;
  border-radius: 4px;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }
`

export const Select = styled.select`
  padding: 7px;
  width: 100%;
  border: 2px solid #1d1d1d;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }

  option {
    background-color: #fff;
    color: #1d1d1d;
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const CheckboxLabel = styled.label`
  color: #333;
  margin-right: 8px;
`

export const CheckboxInput = styled.input`
  appearance: none;
  background-color: #fff;
  border: 2px solid #ccc;
  border-radius: 4px;
  box-shadow: none;
  height: 18px;
  margin-right: 30px;
  width: 18px;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: #aaa;
  }

  &:checked {
    background-color: #37c45b;
    border-color: #37c45b;
    box-shadow: none;

    &:hover {
      background-color: #2e9e4c;
      border-color: #2e9e4c;
    }
  }
`

export const Buttons = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  button {
    border: 0;
    padding: 1rem;
    background: #4b000f;
    border: 1px solid black;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    width: 300px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:hover {
      background: #800020;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
    }
  }
`

export const LogContainer = styled.div`
  width: 800px;
  height: 400px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 5px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }
`

export const LogItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;

  .log-timestamp {
    color: #999;
    font-size: 12px;
    margin-right: 10px;
    white-space: nowrap;
  }

  .log-message {
    color: #333;
    font-size: 14px;
    font-weight: bold;
    overflow-wrap: break-word;
  }
`
