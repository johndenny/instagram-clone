import { useEffect } from 'react';
import './Inbox.css';

const Inbox = (props) => {
  const {
    setIsInboxOpen,
  } = props;

  useEffect(() => {
    setIsInboxOpen(true);
    return () => setIsInboxOpen(false);
  })

  return (
    <main className='direct-inbox'>

    </main>
  )
};

export default Inbox;