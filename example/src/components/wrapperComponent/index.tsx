function WrapperComponent(props: any) {
  console.log(props, "props");
  return (
    <div>
      from:wrapperComponent
      {props.children}
    </div>
  );
}

export default WrapperComponent;
