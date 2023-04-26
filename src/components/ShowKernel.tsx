import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@hope-ui/solid";
import { createSignal } from "solid-js";
import style from './ShowKernel.module.css'

export function ShowKernel(props: {
  title: string
  kernel: number[][]
}) {
  const [visible, setVisible] = createSignal(false);
  return <>
    <button onClick={() => setVisible(true)}>Show Kernel</button>
    <Modal opened={visible()} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent class={style.dialog}>
        <ModalCloseButton />
        <ModalHeader>
          {props.title}
        </ModalHeader>
        <ModalBody class={style.body}>
          <table>
            {
              props.kernel.map(row => {
                return <tr>
                  {row.map(cell => <td>{cell}</td>)}
                </tr>
              })
            }
          </table>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}
