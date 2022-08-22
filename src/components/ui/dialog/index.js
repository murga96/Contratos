import { Dialog } from 'primereact/dialog';
import React from 'react'

export const DialogComponent = ({children, title, visible, hide}) => {
  return (
    <Dialog
        visible={visible}
        style={{ width: "450px" }}
        header={title}
        modal
        breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
        resizable={false}
        onHide={hide}
      >
       {children}
      </Dialog>
  )
}
