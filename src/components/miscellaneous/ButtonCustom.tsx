import { useEntity, type EntityName } from "@hakit/core";


interface Props{
    entityName:EntityName,
    className:string
}   

export default function ButtonCustom({className,entityName}:Props) {

    const entity = useEntity(entityName)

  return (
    <div onClick={() => entity?.service?.toggle?.()} className={className}>

    </div>
  );
}