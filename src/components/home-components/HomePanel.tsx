import ButtonCustom from "../miscellaneous/ButtonCustom";
import CustomGroup from "../miscellaneous/CustomGroup";
import Layout from "../../Layout";
import { useAreas, type EntityName } from "@hakit/core";

const areaChoice = [
  "Main Floor - Kitchen - Breakfast/Dinner",
  "Main Floor - Kitchen",
];

const customLightNames: Record<string, string> = {
  "light.island_light": "Island - Light",
  "light.stove_light": "Stove - Light",
  "light.breakfast_dinner_table_light": "Breakfast / Dinner Table - Light",
  "light.chandelier_light": "Chandelier - Light",
};

function formatEntityName(entityId: string) {
  const raw = entityId.split(".")[1] ?? entityId;

  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function HomePanel() {
  const areas = useAreas().filter((area) => areaChoice.includes(area.name));

  return (
    <Layout>
      {areas.map((area) => (
        <CustomGroup key={area.area_id} title={area.name} className={""} >
          {area.entities
            .filter(
              (entity) =>
                entity.entity_id.includes("light") &&
                !entity.entity_id.includes("_basic_")
            )
            .map((entity) => (
              <ButtonCustom
                key={entity.entity_id}
                entityName={entity.entity_id as EntityName} className={""}              >
                {customLightNames[entity.entity_id] ??
                  formatEntityName(entity.entity_id)}
              </ButtonCustom>
            ))}
        </CustomGroup>
      ))}
    </Layout>
  );
}