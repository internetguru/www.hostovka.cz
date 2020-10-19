<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  
  <xsl:param name="inputvar-articlebuttons" select="''"/>
  
  <xsl:template match="//li[contains(@id, 'docinfoshare')]">
    <xsl:value-of disable-output-escaping="yes" select="$inputvar-articlebuttons"/>
  </xsl:template>
  
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
