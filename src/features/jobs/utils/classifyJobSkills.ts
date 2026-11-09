export interface ClassifiedJobSkills {
  matched: string[];
  missing: string[];
}

export function classifyJobSkills(
  requiredSkills: readonly string[],
  userSkills: readonly string[],
): ClassifiedJobSkills {
  const normalizedUserSkills = new Set(userSkills.map((skill) => skill.trim().toLocaleLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    if (normalizedUserSkills.has(skill.trim().toLocaleLowerCase())) matched.push(skill);
    else missing.push(skill);
  }

  return { matched, missing };
}
