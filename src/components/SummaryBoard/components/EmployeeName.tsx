import { textColors } from "../../../constants/colors"
import { Button } from "../../ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer"
import { Input } from "../../ui/input"


const EmployeeName = ({ userName, setUserName, isDesktop = false }: { userName: string, setUserName: (userName: string) => void, isDesktop?: boolean }) => {
  return (
    <Drawer>
      <div className={`flex ${isDesktop ? 'gap-2' : 'gap-[5px]'} items-center justify-items-start justify-start`}>
        <DrawerTrigger asChild>
          <Button variant='outline' className="h-[50px] text-wrap" size={isDesktop ? 'default' : 'sm'}>
            Zmeniť meno
          </Button>
        </DrawerTrigger>
        <div className='flex flex-col items-start'>
          <span className={`font-semibold text-sm ${textColors.label}`}>Meno:</span>
          <span className='text-start font-bold'>{userName || 'Meno Zamestnanca'}</span>
        </div>
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
