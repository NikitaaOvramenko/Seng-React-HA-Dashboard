import { Group } from "@hakit/components";
import ButtonCustom from "../miscellaneous/ButtonCustom";
import Layout from "../../Layout";
import { useAreas, type EntityName } from "@hakit/core";
import PageHeader from "../miscellaneous/PageHeader";
import { Trees } from "lucide-react";

const areaChoice = ["Deck", "Front Door", "Outside"];

const areaDisplayNames: Record<string, string> = {
  "Deck": "Deck",
  "Front Door": "Front Door",
  "Outside": "Outside",
};

const customLightNames: Record<string, string> = {
  "light.in_wall_600w_dimmer_9":  "Main Deck Top Lights",
  "light.in_wall_600w_dimmer_12": "Main Deck Low Lights",
  "light.in_wall_600w_dimmer_11": "Porch Lantern Lights",
  "light.in_wall_600w_dimmer_10": "Patio Stone Area",
  "light.in_wall_600w_dimmer_7":  "Costed Motion Light",
  "light.in_wall_600w_dimmer_14": "East Roof And Drive Way Lights",
  "light.in_wall_600w_dimmer_8":  "West - Roof + Porch Lights",
  "light.in_wall_600w_dimmer_6":  "Garage Lights",
  "light.in_wall_600w_dimmer_13": "Parking Lot Lights",
};

function formatEntityName(entityId: string) {
  const raw = entityId.split(".")[1] ?? entityId;
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function OutsidePanel() {
  const areas = useAreas().filter((area) => areaChoice.includes(area.name));

  return (
    <div>
      <PageHeader icon={Trees} title="Outside" />
      <Layout>
        {areas.map((area) => (
          <Group
            key={area.area_id}
            cssStyles={{ color: "white", backgroundColor: "#141414", border: "1px solid #262626" }}
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
          </Group>
        ))}
      </Layout>
    </div>
  );
}
