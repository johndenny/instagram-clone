import './NewMessage.css';
import { useState } from 'react';

const NewMessage = () => {
  const [recipientString, setRecipientString] = useState('');

  const onChangeHandler = (event) => {
    const { value } = event.target;
    setRecipientString(value);
  }

  return (
    <main className='new-message'>
      <form className='new-message-form'>
        <h2 className='to-title-text'>
          To:
        </h2>
        <input 
          autoComplete='off'
          className='new-message-to-input'
          placeholder='Search...'
          spellCheck='false'
          type='text'
          onChange={onChangeHandler}
          value={recipientString}
        />
      </form>
    </main>
  )
}

export default NewMessage;