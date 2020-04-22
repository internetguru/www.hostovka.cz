<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:param name="breadcrumb" select="''"/>

  <xsl:template match="/body">
    <body>
      <xsl:copy-of select="@*"/>
      <div id="header">
        <div>
          <xsl:value-of disable-output-escaping="yes" select="$breadcrumb"/>
          <xsl:value-of disable-output-escaping="yes" select="$inputvar-tags-files-list"/>
        </div>
      </div>
      <div id="content">
        <xsl:apply-templates/>
      </div>
    </body>
  </xsl:template>

<!--   <xsl:template match="h1"/> -->
<!--   <xsl:template match="h1/following-sibling::p"/> -->
    
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
