import * as React from 'react';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash'


export default function AutocompleteSearch({ onChange }) {
  const debouncedChange = React.useCallback(debounce(onChange, 500), [onChange])

  const handleChange = (event) => {
    debouncedChange(event.target.value)
  }

  return (<TextField id="outlined-basic" label="Tìm kiếm" variant="outlined" sx={{ width: 500 }}
    onChange={handleChange}
  />)

}
