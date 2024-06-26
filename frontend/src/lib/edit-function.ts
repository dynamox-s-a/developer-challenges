import { updateMonitor } from "@/actions/monitorManegement";
import { updateSensor } from "@/actions/sensorManegement";



export default async function EditElement(elementId: number, elementType: string) {

    if (elementType === 'monitor') {
        try {
           const editMonitor = await updateMonitor()
        } catch (error) {
            
        }
        // Call edit function
    } else if (elementType === 'sensor') {
        updateSensor()
        // Call edit function
    }

}
