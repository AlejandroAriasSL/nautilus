import DIContainer from "@src/DIContainer";

export default function Autowired(
  target: any,
  context: ClassMemberDecoratorContext
) {
  console.log(target, context);
  context.addInitializer(async function (this: any) {
    let AUTOWIRED_METADATA : any[] = [];

    try {
      AUTOWIRED_METADATA = (await import("@generated/autowired-metadata")).AUTOWIRED_METADATA;
    } catch(error) {
      console.error(`Error during module resolution, more details: ${error} at ${console.trace()}`)
    }

    if (AUTOWIRED_METADATA.length === 0) return;

    const entry = AUTOWIRED_METADATA.find(
      (meta) =>
        meta.targetClass === this.constructor.name &&
        meta.propertyKey === String(context.name)
    );

    if (!entry) return;

    console.log(entry.type);

    const dep: any = DIContainer.getInstance().getByTypeName<any>(entry.type);

    (this as any)[context.name as string] = dep;

    console.log(`Dependency resolved for ${String(context.name)}:`, dep);
  });
}
