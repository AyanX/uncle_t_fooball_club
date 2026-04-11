import React from 'react'
import PuffLoader from 'react-spinners/PuffLoader'

type Props = {
  size?: number
}

const PuffLoaderSpinner :React.FC<Props> = ({size = 50}) => {
        return <div className="puff-loader" style={{width:"100%" , height:"100%", display:"grid", placeItems:"center"}}>
            <PuffLoader size={size} />
            </div>
}

export default PuffLoaderSpinner