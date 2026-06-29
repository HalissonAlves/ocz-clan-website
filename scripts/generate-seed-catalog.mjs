import fs from "node:fs";

const competitions = JSON.parse(
  fs.readFileSync("data/competitions.json", "utf8"),
);
const trophies = JSON.parse(fs.readFileSync("data/trophies.json", "utf8"));

function sql(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlArray(values) {
  if (!values?.length) {
    return "'{}'::text[]";
  }

  return `array[${values.map(sql).join(", ")}]::text[]`;
}

const lines = [];
lines.push("begin;");
lines.push("");
lines.push("insert into public.competitions (");
lines.push("  legacy_id,");
lines.push("  name,");
lines.push("  slug,");
lines.push("  category,");
lines.push("  target_type,");
lines.push("  target_slug,");
lines.push("  target_label,");
lines.push("  objective,");
lines.push("  allowed_weapons,");
lines.push("  special_conditions,");
lines.push("  trophy_image_url,");
lines.push("  active");
lines.push(")");
lines.push("values");
lines.push(
  competitions
    .map((competition) => {
      const target = competition.target ?? {};
      return `  (${[
        sql(competition.id),
        sql(competition.name),
        sql(competition.id),
        sql(competition.category),
        sql(target.type),
        sql(target.slug),
        sql(target.label),
        sql(competition.objective),
        sqlArray(competition.allowedWeapons),
        sqlArray(competition.specialConditions),
        sql(competition.trophyImage),
        "true",
      ].join(", ")})`;
    })
    .join(",\n"),
);
lines.push("on conflict (legacy_id) do update");
lines.push("set");
lines.push("  name = excluded.name,");
lines.push("  slug = excluded.slug,");
lines.push("  category = excluded.category,");
lines.push("  target_type = excluded.target_type,");
lines.push("  target_slug = excluded.target_slug,");
lines.push("  target_label = excluded.target_label,");
lines.push("  objective = excluded.objective,");
lines.push("  allowed_weapons = excluded.allowed_weapons,");
lines.push("  special_conditions = excluded.special_conditions,");
lines.push("  trophy_image_url = excluded.trophy_image_url,");
lines.push("  active = excluded.active;");
lines.push("");

for (const trophy of trophies) {
  lines.push("insert into public.trophies (");
  lines.push("  legacy_id,");
  lines.push("  competition_id,");
  lines.push("  winner_player_id,");
  lines.push("  edition,");
  lines.push("  trophy_date,");
  lines.push("  weapon,");
  lines.push("  reserve,");
  lines.push("  details");
  lines.push(")");
  lines.push("select");
  lines.push(`  ${sql(trophy.id)},`);
  lines.push("  competitions.id,");
  lines.push("  players.id,");
  lines.push(`  ${Number(trophy.edition)},`);
  lines.push(`  ${sql(trophy.date)}::date,`);
  lines.push(`  ${sql(trophy.weapon)},`);
  lines.push(`  ${sql(trophy.reserve)},`);
  lines.push(`  ${sql(trophy.details)}`);
  lines.push("from public.competitions");
  lines.push("cross join public.players");
  lines.push(`where competitions.legacy_id = ${sql(trophy.competitionId)}`);
  lines.push(`  and players.legacy_id = ${sql(trophy.winnerId)}`);
  lines.push("on conflict (legacy_id) do update");
  lines.push("set");
  lines.push("  competition_id = excluded.competition_id,");
  lines.push("  winner_player_id = excluded.winner_player_id,");
  lines.push("  edition = excluded.edition,");
  lines.push("  trophy_date = excluded.trophy_date,");
  lines.push("  weapon = excluded.weapon,");
  lines.push("  reserve = excluded.reserve,");
  lines.push("  details = excluded.details;");
  lines.push("");
}

lines.push("commit;");
lines.push("");

fs.writeFileSync(
  "supabase/migrations/005_seed_json_catalog.sql",
  lines.join("\n"),
  "utf8",
);
