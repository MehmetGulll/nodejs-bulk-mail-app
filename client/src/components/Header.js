import React from 'react';

function Header(){
    return(
        <div className='flex flex-row items-center bg-white rounded-lg p-8 justify-between'>
            <div className='text-3xl font-semibold'>BulkMail App</div>
            <div className='flex flex-row gap-3'>
                <div>Ana Sayfa</div>
                <div>Mailler</div>
            </div>
        </div>
    )
}

export default Header;
    