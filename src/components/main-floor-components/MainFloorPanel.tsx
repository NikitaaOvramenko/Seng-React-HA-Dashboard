import ButtonCustom from "../miscellaneous/ButtonCustom";
import Layout from "../../Layout";
import { useAreas, type EntityName } from "@hakit/core";
import PageHeader from "../miscellaneous/PageHeader";
import { LayoutPanelTop } from "lucide-react";
import CustomGroup from "../miscellaneous/CustomGroup";

const areaChoice = [
  "Main Floor - Kitchen - Breakfast/Dinner",
  "Main Floor - Kitchen",
];

const areaDisplayNames: Record<string, string> = {
  "Main Floor - Kitchen": "Kitchen",
  "Main Floor - Kitchen - Breakfast/Dinner": "Dining - Area",
};

const customLightNames: Record<string, string> = {
  "light.in_wall_600w_dimmer_3": "Island - Light",
  "light.in_wall_600w_dimmer_2": "Stove - Light",
  "light.in_wall_600w_dimmer_4": "Breakfast / Dinner Table - Light",
  "light.in_wall_600w_dimmer_5": "Chandelier - Light",
};

function formatEntityName(entityId: string) {
  const raw = entityId.split(".")[1] ?? entityId;
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function MainFloorPanel() {
  const areas = useAreas().filter((area) => areaChoice.includes(area.name));

  return (
    <div>
      <PageHeader icon={LayoutPanelTop} title="Main - Floor" />
      <Layout>
        {areas.map((area) => (
          <CustomGroup
            key={area.area_id}
           
            className="flex flex-col text-white"
            title={areaDisplayNames[area.name] ?? area.name}
          >
            {area.entities
              .filter(
                (entity) =>
                  entity.entity_id.includes("light") &&
                  !entity.entity_id.includes("_basic_")
              )
              .map((entity) => (
                <ButtonCustom
                  className="text-white"
                  key={entity.entity_id}
                  entityName={entity.entity_id as EntityName}
                >
                  {customLightNames[entity.entity_id] ??
                    formatEntityName(entity.entity_id)}
                </ButtonCustom>
              ))}
          </CustomGroup>
        ))}
      </Layout>
    </div>
  );
}
