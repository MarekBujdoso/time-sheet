import { textColors } from "../../../constants/colors"
import { Button } from "../../ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer"
import { Input } from "../../ui/input"


const EmployeeName = ({ userName, setUserName }: { userName: string, setUserName: (userName: string) => void }) => {
    return (
        <Drawer>
          <div className='flex flex-grow gap-2 items-center justify-items-start justify-start'>
            <div className='flex flex-col items-start flex-grow'>
              <span className={`font-semibold text-sm ${textColors.label}`}>Meno:</span>
              <span className='flex-grow text-start font-bold'>{userName || 'Meno Zamestnanca'}</span>
            </div>
            <DrawerTrigger asChild>
              <Button variant='outline' className='justify-self-end text-sm'>
                Zmeniť
              </Button>
            </DrawerTrigger>
          </div>
          <DrawerContent>
            <div className='mx-auto w-full max-w-sm'>
              <DrawerHeader>
                <DrawerTitle>Meno zamestnanca:</DrawerTitle>
                <DrawerDescription>
                  Uveďte meno zamestnanca pre ktorého evidujeme pracovný čas.
                </DrawerDescription>
              </DrawerHeader>
              <Input
                className='mx-auto w-[91%]'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <DrawerFooter>
                <DrawerClose asChild>
                  <div className='flex justify-between'>
                    <Button variant='outline' type='reset'>
                      Zrušiť
                    </Button>
                    <Button variant='default'>Uložiť</Button>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
    )
}

export default EmployeeName;
