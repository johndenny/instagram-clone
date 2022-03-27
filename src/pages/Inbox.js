import './Inbox.css';

const Inbox = () => {
  return (
    <div className='inbox-wrapper'>
      <h1 className='inbox-header'>INBOX</h1>
        <div className='animation-wrapper'>
          <svg aria-label="Loading..." className='spinner' viewBox="0 0 100 100">
            <rect fill="#555555" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim1" 
                attributeType="xml"
                attributeName="opacity" 
                begin="0s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim2" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".1s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim3" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".2s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim4" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".3s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim5" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".4s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim6" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".5s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim7" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".6s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim8" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".7s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim9" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".8s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim10" 
                attributeType="xml"
                attributeName="opacity" 
                begin=".9s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim11" 
                attributeType="xml"
                attributeName="opacity" 
                begin="1s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
            <rect fill="#555555" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47">
              <animate 
                id="anim12" 
                attributeType="xml"
                attributeName="opacity" 
                begin="1.1s" 
                values="1;0;" 
                dur="1.2s"
                repeatCount="indefinite" 
              />
            </rect>
          </svg>            
        </div>  
    </div>
  )
};

export default Inbox;